const { Client } = require('@elastic/elasticsearch');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

class SearchService {
  async indexProduct(product) {
    try {
      await client.index({
        index: 'products',
        id: product.id,
        document: {
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          tags: product.tags || [],
          brand: product.brand,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      });
    } catch (error) {
      console.error('Error indexing product:', error);
      throw error;
    }
  }

  async searchProducts(query, filters = {}, page = 1, limit = 10) {
    try {
      const must = [{
        multi_match: {
          query,
          fields: ['name^2', 'description', 'brand', 'category', 'tags'],
          fuzziness: 'AUTO'
        }
      }];

      // Add filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          must.push({
            match: { [field]: value }
          });
        }
      });

      const { hits } = await client.search({
        index: 'products',
        body: {
          from: (page - 1) * limit,
          size: limit,
          query: {
            bool: { must }
          },
          sort: [
            { _score: 'desc' },
            { createdAt: 'desc' }
          ],
          aggs: {
            categories: {
              terms: { field: 'category.keyword' }
            },
            brands: {
              terms: { field: 'brand.keyword' }
            },
            price_ranges: {
              range: {
                field: 'price',
                ranges: [
                  { to: 50 },
                  { from: 50, to: 100 },
                  { from: 100, to: 200 },
                  { from: 200 }
                ]
              }
            }
          }
        }
      });

      const products = await prisma.product.findMany({
        where: {
          id: {
            in: hits.hits.map(hit => hit._id)
          }
        }
      });

      return {
        products,
        total: hits.total.value,
        aggregations: hits.aggregations
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  async reindexAllProducts() {
    try {
      // Delete existing index
      await client.indices.delete({
        index: 'products',
        ignore_unavailable: true
      });

      // Create new index with settings and mappings
      await client.indices.create({
        index: 'products',
        body: {
          settings: {
            analysis: {
              analyzer: {
                custom_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'snowball']
                }
              }
            }
          },
          mappings: {
            properties: {
              name: { type: 'text', analyzer: 'custom_analyzer' },
              description: { type: 'text', analyzer: 'custom_analyzer' },
              category: { type: 'keyword' },
              brand: { type: 'keyword' },
              price: { type: 'float' },
              tags: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
        }
      });

      // Fetch all products and index them
      const products = await prisma.product.findMany();
      const operations = products.flatMap(product => [
        { index: { _index: 'products', _id: product.id } },
        {
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          tags: product.tags || [],
          brand: product.brand,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      ]);

      if (operations.length > 0) {
        await client.bulk({ refresh: true, operations });
      }

      return { message: 'Reindexing completed successfully' };
    } catch (error) {
      console.error('Error reindexing products:', error);
      throw error;
    }
  }
}

module.exports = new SearchService();