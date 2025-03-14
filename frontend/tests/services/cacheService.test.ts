import { renderHook, act } from '@testing-library/react';
import CacheService, { useCache } from '../../src/services/cacheService';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = CacheService.getInstance();
    cacheService.clear();
  });

  it('should be a singleton', () => {
    const instance1 = CacheService.getInstance();
    const instance2 = CacheService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should set and get data correctly', () => {
    const testData = { test: 'data' };
    cacheService.set('test-key', testData);
    expect(cacheService.get('test-key')).toEqual(testData);
  });

  it('should return null for expired items', () => {
    const testData = { test: 'data' };
    cacheService.setConfig({ ttl: 0 }); // Set TTL to 0 to make items expire immediately
    cacheService.set('test-key', testData);
    expect(cacheService.get('test-key')).toBeNull();
  });

  it('should remove oldest item when cache is full', () => {
    cacheService.setConfig({ maxItems: 2 });
    cacheService.set('key1', 'value1');
    cacheService.set('key2', 'value2');
    cacheService.set('key3', 'value3');

    expect(cacheService.get('key1')).toBeNull();
    expect(cacheService.get('key2')).toBe('value2');
    expect(cacheService.get('key3')).toBe('value3');
  });

  it('should clear all items', () => {
    cacheService.set('key1', 'value1');
    cacheService.set('key2', 'value2');
    cacheService.clear();

    expect(cacheService.get('key1')).toBeNull();
    expect(cacheService.get('key2')).toBeNull();
  });

  it('should remove specific item', () => {
    cacheService.set('key1', 'value1');
    cacheService.set('key2', 'value2');
    cacheService.remove('key1');

    expect(cacheService.get('key1')).toBeNull();
    expect(cacheService.get('key2')).toBe('value2');
  });
});

describe('useCache hook', () => {
  const mockData = { test: 'data' };
  const mockFetch = jest.fn().mockResolvedValue(mockData);

  beforeEach(() => {
    mockFetch.mockClear();
    CacheService.getInstance().clear();
  });

  it('should fetch and cache data', async () => {
    const { result } = renderHook(() => useCache('test-key', mockFetch));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return cached data without fetching', async () => {
    const cacheService = CacheService.getInstance();
    cacheService.set('test-key', mockData);

    const { result } = renderHook(() => useCache('test-key', mockFetch));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Fetch failed');
    const mockFailedFetch = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useCache('test-key', mockFailedFetch));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(error);
  });
});