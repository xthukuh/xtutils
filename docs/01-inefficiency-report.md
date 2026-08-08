# xtutils Inefficiency Report

## High-Impact Candidates

1. **Set cloning resets recursion cache per item**  
   - File: `/lib/utils/_clone.ts:67`  
   - Pattern: `clone(v, new Map())` inside Set cloning loop.  
   - Impact: repeated cache allocation, degraded performance, and broken circular-reference continuity for nested values.

2. **Descriptor merge recursion reallocates whole objects repeatedly**  
   - File: `/lib/utils/_objects.ts:13-17`  
   - Pattern: recursive `{...a, ...b}` merge across prototype chain.  
   - Impact: high allocation pressure on deep prototypes (quadratic-like behavior).

3. **Property filtering uses repeated linear membership checks**  
   - File: `/lib/utils/_objects.ts:44-59`  
   - Pattern: `excluded_props.includes(v)` inside iteration after rebuilding exclusion arrays.  
   - Impact: avoidable O(n²)-style lookup overhead; favors `Set` membership.

4. **Iterable emptiness checks materialize full iterables**  
   - File: `/lib/utils/_objects.ts:480`  
   - Pattern: `![...value].length`.  
   - Impact: forces full traversal and allocation, unsafe for large/lazy iterables.

5. **Array detection may materialize whole iterable just to read length**  
   - File: `/lib/utils/_objects.ts:523`  
   - Pattern: `value.length ?? [...value].length`.  
   - Impact: full iteration cost in validation path.

## Medium-Impact Candidates

6. **Dot-unflatten normalization does expensive key generation per node**  
   - File: `/lib/utils/_objects.ts:290`  
   - Pattern: `Object.keys([...Array(len)]).join(',')` for array-shape detection.  
   - Impact: repeated temporary arrays/strings during recursive normalization.

7. **Redundant array copying before sort**  
   - File: `/lib/utils/_objects.ts:672`  
   - Pattern: `const items = [...array].slice();`.  
   - Impact: double-copy overhead for all sort operations.

8. **Queue scheduler adds timeout churn under load**  
   - File: `/lib/utils/_promise.ts:140-145,199`  
   - Pattern: repeated `setTimeout` throttling for every queued step.  
   - Impact: event-loop overhead and artificial latency in high-throughput async queues.

9. **URL validator recompiles regex per call**  
   - File: `/lib/utils/_string.ts:441-447`  
   - Pattern: `new RegExp(pattern, 'i')` inside function body.  
   - Impact: avoidable regex compilation overhead in hot paths.

10. **CSV conversion duplicates iterable data before processing**  
    - File: `/lib/utils/_string.ts:516`  
    - Pattern: `Object.values([...data])`.  
    - Impact: unnecessary allocations for large datasets.

## Prioritized Optimization Order

1. `_clone` Set-path cache usage.
2. `_empty` / `_isArray` iterable materialization.
3. `_getAllPropertyDescriptors` and `_getAllProperties` allocation/lookup strategy.
4. `_promise` queue scheduler timeouts.
5. `_string` regex/data-copy hotspots.
