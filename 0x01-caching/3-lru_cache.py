#!/usr/bin/python3
"""Task 3: LRU Caching"""

BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """LRU Class"""
    def __init__(self):
        """init function"""
        super().__init__()
        self.use_queue = {}

    def put(self, key, item):
        """Assign item to given key in cache"""
        if (key is not None and item is not None):
            if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                least_used = list(self.use_queue.keys())[0]
                del self.cache_data[least_used]
                del self.use_queue[least_used]
                print(f"DISCARD: {least_used}")
            self.cache_data[key] = item
            if key in self.use_queue:
                del self.use_queue[key]
            self.use_queue[key] = ""

    def get(self, key):
        """Retrieve item through given key from cache"""
        if (key is None or key not in self.cache_data):
            return None
        if key in self.use_queue:
            del self.use_queue[key]
        self.use_queue[key] = ""
        return self.cache_data[key]
