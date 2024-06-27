#!/usr/bin/python3
"""Task 3: LRU Caching"""
BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """LRU Class"""
    def __init__(self):
        """init function"""
        super().__init__()
        self.use_queue = []

    def put(self, key, item):
        """Assign item to given key in cache"""
        if (key is not None and item is not None):
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                least_used = self.use_queue.pop(0)
                self.cache_data.pop(least_used)
                print(f"DISCARD: {least_used}")
            self.cache_data[key] = item
            self.use_queue.append(key)

    def get(self, key):
        """Retrieve item through given key from cache"""
        if (key is None or key not in self.cache_data):
            return None
        self.use_queue.remove(key)
        self.use_queue.append(key)
        return self.cache_data[key]