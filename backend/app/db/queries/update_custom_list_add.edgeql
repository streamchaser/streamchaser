update CustomList
filter .id = <uuid>$id
set {
  media += (
    insert Media { streamchaser_id := <str>$streamchaser_id }
    unless conflict on .streamchaser_id
    else (
      select Media filter .streamchaser_id = <str>$streamchaser_id
    )
  )
};
