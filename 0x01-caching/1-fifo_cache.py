#!/usr/bin/python3
"""Task 1: FIFO caching"""

BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """FIFO Class"""
    def __init__(self):
        """init function"""
        super().__init__()

    def put(self, key, item):
        """Assign item to given key in cache"""
        if (key is not None and item is not None):
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                drop = next(iter(self.cache_data.items()))
                del self.cache_data[drop[0]]
                print(f"DISCARD: {drop[0]}")

    def get(self, key):
        """Retrieve item through given key from cache"""
        if (key is None or key not in self.cache_data):
            return None
        return self.cache_data[key]
