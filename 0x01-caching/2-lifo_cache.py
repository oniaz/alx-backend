#!/usr/bin/python3
"""Task 2: LIFO Caching"""

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """LIFO Class"""
    def __init__(self):
        """init function"""
        super().__init__()

    def put(self, key, item):
        """Assign item to given key in cache"""
        if (key is not None and item is not None):
            if (key in self.cache_data):
                del self.cache_data[key]
            else:
                if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                    last_item = next(reversed(self.cache_data.items()))
                    del self.cache_data[last_item[0]]
                    print(f"DISCARD: {last_item[0]}")
            self.cache_data[key] = item

    def get(self, key):
        """Retrieve item through given key from cache"""
        if (key is None or key not in self.cache_data):
            return None
        return self.cache_data[key]
