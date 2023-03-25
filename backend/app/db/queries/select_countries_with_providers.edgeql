select Country {
  id,
  label,
  value
}
filter exists(.providers)
# We sort by label, but need to split because
# of the unicode flag "🇩🇿 Algeria"
order by str_split(.label, " ")[1]
