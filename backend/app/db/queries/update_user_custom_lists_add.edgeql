update User
filter .email = <str>$email
set {
   custom_lists += (
    insert CustomList { name := <str>$list_name }
  )
};
select User {
  custom_lists
}
