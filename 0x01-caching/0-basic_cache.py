#!/usr/bin/python3
"""Task 0: Basic Dictionary"""

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """Basic Cache Class"""

    def put(self, key, item):
        """Assign item to given key in cache"""
        if (key is not None and item is not None):
            self.cache_data[key] = item

    def get(self, key):
        """Retrieve item through given key from cache"""
        if (key is None or key not in self.cache_data):
            return None
        return self.cache_data[key]
