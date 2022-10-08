export class CacheBuilder<K, V> {
  expireAfterWrite(duration: number): CacheBuilder<K, V>

  expireAfterAccess(duration: number): CacheBuilder<K, V>

  maximumSize(size: number): CacheBuilder<K, V>

  build(): Cache<K, V>

  build(
    fetcher: (key: K) => V | undefined | null
  ): LoadingCache<K, V>
}

export class Cache<K, V> {
  setExpireAfterWrite(duration: number): void

  setExpireAfterAccess(duration: number): void

  setMaximumSize(size: number): void
}

export class LoadingCache<K, V> extends Cache<K, V> {
  /**
   * Include all methods from @link Cache<K, V>
   */
}