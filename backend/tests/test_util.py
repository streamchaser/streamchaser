from app.util import chunkify


def test_chunkify():
    # Test empty list
    lst = []
    chunk_size = 5
    expected_chunks = []
    expected_num_chunks = 0
    chunks, num_chunks = chunkify(lst, chunk_size)
    assert list(chunks) == expected_chunks
    assert num_chunks == expected_num_chunks

    # Test non-empty list with chunk size larger than list length
    lst = [1, 2, 3, 4, 5]
    chunk_size = 10
    expected_chunks = [[1, 2, 3, 4, 5]]
    expected_num_chunks = 1
    chunks, num_chunks = chunkify(lst, chunk_size)
    assert list(chunks) == expected_chunks
    assert num_chunks == expected_num_chunks

    # Test non-empty list with chunk size smaller than list length
    lst = [1, 2, 3, 4, 5]
    chunk_size = 2
    expected_chunks = [[1, 4], [2, 5], [3]]
    expected_num_chunks = 3
    chunks, num_chunks = chunkify(lst, chunk_size)
    assert list(chunks) == expected_chunks
    assert num_chunks == expected_num_chunks
