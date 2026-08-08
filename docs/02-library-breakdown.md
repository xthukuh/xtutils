# xtutils Library Breakdown

## Package Surface

- Package type: TypeScript utility library with compiled `dist/` output
- Public root entrypoint: `/lib/index.ts`
- Root re-exports: `Buffer`, `utils`, `ElapsedTime`, `Term`, `Animate`, `EventEmitter`, `FilePath`, `AlphaNum`, `Color`

## Module-by-Module Inventory

### `utils`

- Files: 17
- Non-empty LOC: 4127
- Exported declarations: 162

- `/lib/utils/_batch.ts`
  - const: `_batchValues`
- `/lib/utils/_clone.ts`
  - const: `_clone`
- `/lib/utils/_cloneDeep.ts`
  - const: `clonePrototype`
  - interface: `IDeepCloneOptions`
  - function: `_cloneDeep`
- `/lib/utils/_compare.ts`
  - const: `_compare`
- `/lib/utils/_compareShallow.ts`
  - const: `_compareShallow`
- `/lib/utils/_datetime.ts`
  - const: `_isDate`, `_parseIso`, `_date`, `_time`, `DAY_NAMES`, `_dayName`, `MONTH_NAMES`, `_monthName`, `_dayStart`, `_dayEnd`, `_monthStart`, `_monthEnd`, `_yearStart`, `_yearEnd`, `_dateOnly`, `_dayTime`, `_datetime`, `_datestr`, `_timestr`, `YEAR_MS`, `MONTH_MS`, `DAY_MS`, `HOUR_MS`, `MINUTE_MS`, `SECOND_MS`, `_elapsed`, `_duration`
  - interface: `IDuration`
- `/lib/utils/_debouced.ts`
  - const: `_debouced`
- `/lib/utils/_hello.ts`
  - const: `_sayHello`
- `/lib/utils/_json.ts`
  - const: `_jsonStringify`, `_jsonParse`, `_jsonCopy`, `_isObjJson`
- `/lib/utils/_number.ts`
  - const: `_numeric`, `_num`, `_posNum`, `_int`, `_posInt`, `_round`, `_commas`, `_rand`, `_px2rem`, `_bytesVal`, `_dec2base`, `_dec2bin`, `_bin2dec`, `_dec2hex`, `_hex2dec`, `_dec2oct`, `_oct2dec`, `_base2dec`, `_deg2rad`, `_rad2deg`, `_distance`, `_logx`, `_numk`, `_parse_int`, `_parse_float`, `_clamp`, `_xcolumn`
  - type: `TXColumn`
- `/lib/utils/_objects.ts`
  - const: `_getAllPropertyDescriptors`, `_getAllProperties`, `_hasProp`, `_hasProps`, `_hasAnyProps`, `_getProp`, `_isClass`, `_isFunc`, `_minMax`, `_dotFlat`, `_dotInflate`, `_validDotPath`, `_bool`, `_dotGet`, `_valueOf`, `_empty`, `_iterable`, `_isObject`, `_isArray`, `_values`, `_flatten`, `_dumpVal`, `_sort`, `_trans`, `_arrayList`, `_array2d`, `_rows2cols`, `_mapValues`, `_propsObj`, `_chunks`, `_selectKeys`, `_tree`
  - interface: `IProperty`, `ITreeOptions`
  - type: `TSortMode`, `TSortOrder`
  - class: `FailError`
- `/lib/utils/_promise.ts`
  - interface: `IPromiseResult`, `IPending`, `IPendingPromise`
  - const: `_asyncAll`, `_asyncQueue`, `_asyncValues`, `_sleep`, `PENDING_CACHE`, `_pending`, `_pendingAbort`
  - class: `PendingAbortError`
- `/lib/utils/_queue.ts`
  - interface: `IQueue`
  - const: `_queue`
- `/lib/utils/_rc4.ts`
  - function: `_rc4`
- `/lib/utils/_string.ts`
  - const: `_xuid`, `_uid`, `_uuid`, `_string`, `_stringable`, `_str`, `_strNorm`, `_regEscape`, `_strEscape`, `_sqlEscape`, `_trim`, `_ltrim`, `_rtrim`, `_toTitleCase`, `_toSentenceCase`, `_toSnakeCase`, `_toSlugCase`, `_toStudlyCase`, `_toCamelCase`, `_toLowerCase`, `_toUpperCase`, `_hashCode`, `_hashCodeStr`, `_hash53`, `_parseDataUri`, `_isUrl`, `_isEmail`, `_parseCsv`, `_toCsv`, `_split`, `_errorText`, `_textMaxLength`, `_cr`, `_keyValue`, `_parseKeyValues`, `_strKeyValues`, `_wrapLines`
  - interface: `IDataUri`
- `/lib/utils/_utf8.ts`
  - const: `_escape`, `_unescape`, `_utf8Encode`, `_utf8Decode`
- `/lib/utils/index.ts`
  - Re-exports: `./_batch`, `./_clone`, `./_cloneDeep`, `./_compare`, `./_compareShallow`, `./_datetime`, `./_debouced`, `./_hello`, `./_json`, `./_number`, `./_objects`, `./_promise`, `./_queue`, `./_string`, `./_utf8`, `./_rc4`

### `Color`

- Files: 3
- Non-empty LOC: 755
- Exported declarations: 8

- `/lib/Color/_Color.ts`
  - type: `TColorValue`
  - interface: `IColorTo`, `IStaticColorTo`, `IColor`, `IStaticColorFrom`, `IColorConstructor`
  - class: `Color`
- `/lib/Color/_ColorNames.ts`
  - const: `ColorNames`
- `/lib/Color/index.ts`
  - Re-exports: `./_ColorNames`, `./_Color`

### `Term`

- Files: 2
- Non-empty LOC: 731
- Exported declarations: 2

- `/lib/Term/_Term.ts`
  - interface: `ITermFormat`
  - class: `Term`
- `/lib/Term/index.ts`
  - Re-exports: `./_Term`

### `Animate`

- Files: 4
- Non-empty LOC: 492
- Exported declarations: 12

- `/lib/Animate/_animate.ts`
  - interface: `IAnimateOptions`, `IAnimation`
  - const: `ANIMATE_DEFAULT_EASING`, `ANIMATE_DEFAULT_DURATION`
  - function: `_animate`
- `/lib/Animate/_easing_functions.ts`
  - type: `TEasingFunction`, `TEasing`, `TEasingKey`
  - const: `Easing`, `_tween`
- `/lib/Animate/_polyfill.ts`
  - const: `requestAnimationFrame`, `cancelAnimationFrame`
- `/lib/Animate/index.ts`
  - Re-exports: `./_animate`, `./_easing_functions`, `./_polyfill`

### `FilePath`

- Files: 3
- Non-empty LOC: 415
- Exported declarations: 9

- `/lib/FilePath/_mime.ts`
  - const: `EXT_MIMES`, `_mime`
  - interface: `IMimeType`
- `/lib/FilePath/_path.ts`
  - interface: `IBasename`, `IBasenameError`, `IFilePath`, `IFilePathError`
  - const: `_basename`, `_filepath`
- `/lib/FilePath/index.ts`
  - Re-exports: `./_mime`, `./_path`

### `EventEmitter`

- Files: 3
- Non-empty LOC: 273
- Exported declarations: 3

- `/lib/EventEmitter/_EventEmitter.ts`
  - interface: `IEvent`
  - class: `EventEmitter`
- `/lib/EventEmitter/_Events.ts`
  - const: `Events`
- `/lib/EventEmitter/index.ts`
  - Re-exports: `./_EventEmitter`, `./_Events`

### `AlphaNum`

- Files: 2
- Non-empty LOC: 199
- Exported declarations: 1

- `/lib/AlphaNum/_AlphaNum.ts`
  - class: `AlphaNum`
- `/lib/AlphaNum/index.ts`
  - Re-exports: `./_AlphaNum`

### `ElapsedTime`

- Files: 2
- Non-empty LOC: 100
- Exported declarations: 1

- `/lib/ElapsedTime/_ElapsedTime.ts`
  - class: `ElapsedTime`
- `/lib/ElapsedTime/index.ts`
  - Re-exports: `./_ElapsedTime`

### `Buffer`

- Files: 2
- Non-empty LOC: 98
- Exported declarations: 6

- `/lib/Buffer/_Buffer.ts`
  - type: `TBufferEncoding`
  - const: `_isBuffer`, `_isBufferType`, `_isBufferEncoding`, `_base64Encode`, `_base64Decode`
- `/lib/Buffer/index.ts`
  - Re-exports: `./_Buffer`

### `(root)`

- Files: 1
- Non-empty LOC: 9
- Exported declarations: 0

- `/lib/index.ts`
  - Re-exports: `./Buffer`, `./utils`, `./ElapsedTime`, `./Term`, `./Animate`, `./EventEmitter`, `./FilePath`, `./AlphaNum`, `./Color`

