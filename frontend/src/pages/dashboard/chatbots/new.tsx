import { useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Link, FileText, Globe } from 'lucide-react';

const NewChatbot: NextPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [googleDocsUrl, setGoogleDocsUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [productLinks, setProductLinks] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleProductLinkChange = (index: number, value: string) => {
    const updatedLinks = [...productLinks];
    updatedLinks[index] = value;
    setProductLinks(updatedLinks);
  };

  const addProductLink = () => {
    setProductLinks([...productLinks, '']);
  };

  const removeProductLink = (index: number) => {
    const updatedLinks = productLinks.filter((_, i) => i !== index);
    setProductLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('textContent', textContent);
      formData.append('googleDocsUrl', googleDocsUrl);
      formData.append('websiteUrl', websiteUrl);
      formData.append('productLinks', JSON.stringify(productLinks));

      files.forEach((file) => {
        formData.append('files', file);
      });

      await axios.post('/api/chatbot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      window.location.href = '/dashboard/chatbots';
    } catch (error) {
      console.error('Error creating chatbot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Chatbot</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Chatbot Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Content Sources</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="textContent">Text Content</Label>
                <Textarea
                  id="textContent"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  placeholder="Enter or paste your content here..."
                />
              </div>

              <div>
                <Label htmlFor="files" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Files (TXT, PDF, DOCX)</span>
                </Label>
                <Input
                  id="files"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".txt,.pdf,.docx"
                  className="mt-2"
                />
                {files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected files:</p>
                    <ul className="list-disc list-inside">
                      {Array.from(files).map((file, index) => (
                        <li key={index} className="text-sm">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="googleDocs" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Google Docs URL</span>
                </Label>
                <Input
                  id="googleDocs"
                  type="url"
                  value={googleDocsUrl}
                  onChange={(e) => setGoogleDocsUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>E-commerce Website URL</span>
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-ecommerce-site.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Product Links</span>
                </Label>
                {productLinks.map((link, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <Input
                      type="url"
                      value={link}
                      onChange={(e) => handleProductLinkChange(index, e.target.value)}
                      placeholder="https://your-ecommerce-site.com/product"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeProductLink(index)}
                      disabled={productLinks.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProductLink}
                  className="mt-2"
                >
                  Add Product Link
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.href = '/dashboard/chatbots'}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Chatbot'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewChatbot;