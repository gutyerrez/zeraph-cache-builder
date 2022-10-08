import { Redis } from 'ioredis'

import { Cache, LoadingCache } from '@zeraph/cache-builder/data'

export default class ZeraphCache {
  public static redis?: Redis

  public static newBuilder<K, V>(
    fetcher: (key: K) => V | undefined | null
  ): CacheBuilder<K, V> {
    return new CacheBuilder()
  }
}

class CacheBuilder<K, V> {
  private cache!: Cache<K, V> | LoadingCache<K, V>

  constructor() {
    this.cache = new Cache()
  }

  public expireAfterWrite(duration: number): CacheBuilder<K, V> {
    this.cache.expireAfterWrite = duration

    return this
  }

  public expireAfterAccess(duration: number): CacheBuilder<K, V> {
    this.cache.expireAfterAccess = duration

    return this
  }

  public maximumSize(size: number): CacheBuilder<K, V> {
    this.cache.maximumSize = size

    return this
  }

  public build(
    fetcher?: (key: K) => V | undefined | null
  ): Cache<K, V> | LoadingCache<K, V> {
    if (fetcher) {
      return new LoadingCache<K, V>(this.cache, fetcher)
    }

    return this.cache
  }
}