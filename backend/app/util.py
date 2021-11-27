def chunk_list(arr: list, chunk_size: int):
    for i in range(0, len(arr), chunk_size):
        yield arr[i:i+chunk_size]
