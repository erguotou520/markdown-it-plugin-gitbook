# Code test

.

{% code overflow="wrap" %}
```graphql
query GetOnetodo($uid: Int!) @rbac(requireMatchAll: [admin]) # 拥有admin角色用户才能访问 {
  data: todo_findFirsttodo(where: {user_id: {equals: $uid}}) {
    id
    title
    user_id
  }
}
```
{% endcode %}

.

::: code-group

```graphql
query GetOnetodo($uid: Int!) @rbac(requireMatchAll: [admin]) # 拥有admin角色用户才能访问 {
  data: todo_findFirsttodo(where: {user_id: {equals: $uid}}) {
    id
    title
    user_id
  }
}
```

:::

----

{% code title="响应结构" %}
```json
{
  "data": {
    "messages": [
      {
        "id": "0",
        "content": "Hello!"
      },
      {
        "id": "1",
        "content": "Bye!"
      }
    ],
    "deatail": "echo:ssss"
  }
}
```
{% endcode %}

.

::: code-group

```json [响应结构]
{
  "data": {
    "messages": [
      {
        "id": "0",
        "content": "Hello!"
      },
      {
        "id": "1",
        "content": "Bye!"
      }
    ],
    "deatail": "echo:ssss"
  }
}
```

:::