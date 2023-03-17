insert Media {
  title := <str>$title,
  streamchaser_id := <str>$streamchaser_id
}
unless conflict;
