#!/usr/bin/env python3
"""Pagination Fucntion"""

import csv
import math
from typing import Tuple, List, Dict, Union, Optional


class Server:
    """Server class to paginate a database of popular baby names"""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset"""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def index_range(self, page: int, page_size: int) -> Tuple[int, int]:
        """
        Calculate the start and end index for a given page and page size.

        Args:
            page (int): The current page number (1-indexed).
            page_size (int): The number of items per page.

        Returns:
            Tuple[int, int]:
                A tuple containing the start index and end index for the page.
        """
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        return (start_index, end_index)

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieves the data for a specific page from the dataset.

        Args:
            page (int, optional): The page number to retrieve (1-indexed).
                Defaults to 1.
            page_size (int, optional): The number of items per page.
                Defaults to 10.

        Returns:
            List[List]: A list containing the rows corresponding to the
                specified page.
        """
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0

        range = self.index_range(page, page_size)
        return self.dataset()[range[0]:range[1]]

    def get_hyper(
                    self, page: int = 1, page_size: int = 10
                ) -> Dict[str, Union[int, List[List], None]]:
        """
        Generates hypermedia data for a given page of the dataset.

        Args:
            page (int, optional):
                The current page number. Defaults to 1.
            page_size (int, optional):
                The number of items per pageDefaults to 10.

        Returns:
            Dict[str, Union[int, List[List], None]]:
                A dictionary containing hypermedia information.
        """
        data = self.get_page(page, page_size)
        hypermedia = {
            'page_size':
                len(data),
            'page':
                page,
            'data':
                data,
            'next_page':
                page + 1 if self.get_page(page + 1, page_size) else None,
            'prev_page':
                page - 1 if page > 1 else None,
            'total_pages':
                math.ceil(len(self.dataset()) / page_size)
        }
        return hypermedia
