+++
date = "2023-03-13T10:12:41+01:00"
tags = ["retalls"]
slug = "censusgpt"
x_url = "https://censusgpt.com/"
title = "Census GPT"
x_source = ""
syndication = ["https://mastodon.social/@carlesbellver/110015246254853555"]
+++

Aquest web contesta preguntes sobre el cens dels EUA utilitzant ChatGPT. Com ho fa? La clau està en la funció `make_default_messages` del fitxer [`text_to_sql.py`](https://github.com/caesarHQ/textSQL/blob/main/api/app/api/utils/sql_gen/text_to_sql.py), que explica a ChatGPT l’estructura de la base de dades del cens. A partir d’això i d’uns pocs exemples, ChatGPT pot traduir les preguntes subsegüents de l’usuari a sentències SQL que el web executarà i processarà.

```
def make_default_messages(table_names: List[str]):
  return [
    {
      "role": "system",
      "content": (
        "You are a helpful assistant for generating syntactically correct read-only SQL to answer a given question or command, generally about crime, demographics, and population."
        "\n"
        "The following are schemas of tables you can query:\n"
        "---------------------\n" + generate_msg_with_schemas(table_names) +
        "\n\n"
        "---------------------\n"
        "Use state abbreviations for states."
        " Table ’crime_by_city’ does not have columns ’zip_code’ or ’county’."
        " Do not use ambiguous column names."
        " For example, ’city’ can be ambiguous because both tables ’acs_census_data’ and ’crime_by_city’ have a column named ’city’."
        " Always specify the table where you are using the column."
        " If you include a ’city’ column in the result table, include a ’state’ column too."
        " If you include a ’county’ column in the result table, include a ’state’ column too."
        " Make sure each value in the result table is not null.\n"
      )
    },
```

etc.