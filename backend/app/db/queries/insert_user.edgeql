insert User {
  email := <str>$email,
  name := <str>$name
}
unless conflict;
