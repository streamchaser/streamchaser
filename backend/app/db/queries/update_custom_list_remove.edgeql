update CustomList
filter .id = <uuid>$id
set {
  media -= (
    select Media filter .streamchaser_id = <str>$streamchaser_id
  )
};
