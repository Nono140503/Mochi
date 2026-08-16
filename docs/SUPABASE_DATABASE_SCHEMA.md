## Table `profiles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `display_name` | `text` |  Nullable |
| `base_color` | `text` |  Nullable |
| `current_mood` | `text` |  Nullable |
| `streak` | `int4` |  Nullable |
| `last_check_in` | `timestamptz` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `rehearsal_sessions`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `persona_description` | `text` |  |
| `messages` | `jsonb` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `note` | `text` |  Nullable |
| `date` | `timestamptz` |  Nullable |

## Table `focus_sessions`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `duration_seconds` | `int4` |  Nullable |
| `completed` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `duration_minutes` | `int4` |  Nullable |
| `note` | `text` |  Nullable |
| `date` | `timestamptz` |  Nullable |

## Table `check_ins`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `mood` | `text` |  |
| `note` | `text` |  Nullable |
| `reply` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `date` | `timestamptz` |  Nullable |

## Table `memories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `date` | `timestamptz` |  Nullable |
| `mood` | `text` |  |
| `note` | `text` |  Nullable |
| `mode` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `mochidle_prizes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `character_id` | `text` |  |
| `word` | `text` |  |
| `guesses_taken` | `int4` |  |
| `unlocked_at` | `timestamptz` |  Nullable |

## RLS Policies

### `check_ins`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can view own check-ins` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |
| `Users can create check-ins` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Users can manage own check_ins` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `rehearsal_sessions`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can view own rehearsal sessions` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |
| `Users can create rehearsal sessions` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Users can manage own rehearsal_sessions` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `focus_sessions`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can view own focus sessions` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |
| `Users can create focus sessions` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Users can manage own focus_sessions` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `profiles`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Allow users to read their own profile` | SELECT | public | PERMISSIVE | `(auth.uid() = id)` | — |
| `Allow users to insert/update their own profile` | ALL | public | PERMISSIVE | `(auth.uid() = id)` | — |
| `Users can view own profile` | SELECT | public | PERMISSIVE | `(auth.uid() = id)` | — |
| `Users can update own profile` | UPDATE | public | PERMISSIVE | `(auth.uid() = id)` | — |
| `Users can insert own profile` | INSERT | public | PERMISSIVE | — | `(auth.uid() = id)` |

### `memories`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Allow users to read their own memories` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |
| `Allow users to insert their own memories` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Allow users to delete their own memories` | DELETE | public | PERMISSIVE | `(auth.uid() = user_id)` | — |
| `Users can manage own memories` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `mochidle_prizes`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can manage own mochidle_prizes` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

