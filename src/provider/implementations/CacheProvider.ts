import { ICacheProvider } from '@zeraph/cache-builder/provider/ICacheProvider'

import CacheBuilder from '@zeraph/cache-builder'

export class CacheProvider<K, V> implements ICacheProvider<K, V> {
  /**
   * The fetcher function that will be used to fetch the value if it is not present in the cache.
   */
  protected fetcher?: (key: K) => V | undefined | null

  /**
   * The key that will be used to store the cache in redis.
   */
  private CACHE_KEY!: string

  /**
   * @warning This method is not recommended. It is only used for testing purposes.
   * 
   * This method can cause memory leaks if used in production,
   * is recommended to use redis database to store all cache.
   */
  private alwaysAllowInMemoryCache: boolean
  private inMemoryCache: Map<K, V>

  /**
   * All settings for expiring caches
   */
  private expireAfterWrite?: number
  private expireAfterAccess?: number
  private maximumSize?: number

  constructor(
    fetcher?: (key: K) => V | undefined | null,
    alwaysAllowInMemoryCache?: boolean
  ) {
    this.fetcher = fetcher

    // store all values in local memory
    this.alwaysAllowInMemoryCache = alwaysAllowInMemoryCache ?? false

    if (!fetcher) {
      this.inMemoryCache = new Map<K, V>()
    }
  }

  public setKey(key: string): void { this.CACHE_KEY = key }

  public async get(key: K): Promise<V | undefined | null> {
    if (this.alwaysAllowInMemoryCache && this.inMemoryCache.has(key)) {
      return this.inMemoryCache.get(key)
    }

    let stringified = await CacheBuilder.redis?.hget(this.CACHE_KEY, key.toString())

    let value = JSON.parse(stringified ?? 'null') as V | undefined | null

    if (!value) {
      const count = await CacheBuilder.redis?.hlen(this.CACHE_KEY)

      if (count >= this.maximumSize) {
        throw new Error('Cache is full')
      }

      value = this.fetcher?.apply(key) as V | undefined | null

      await this.put(key, value)
    }

    return value
  }

  public async getIfPresent(key: K): Promise<V | undefined | null> {
    if (!this.alwaysAllowInMemoryCache) {
      return null
    }

    if (this.expireAfterAccess) {
      setTimeout(() => {
        this.invalidate(key)
      }, this.expireAfterAccess)
    }

    return this.inMemoryCache.get(key)
  }

  public async getAll(): Promise<Array<V>> {
    if (this.alwaysAllowInMemoryCache) {
      Array.from(this.inMemoryCache.values())
    }

    return await CacheBuilder.redis?.hvals(this.CACHE_KEY) as Array<V>
  }

  public async put(key: K, value: V): Promise<V> {
    if (this.alwaysAllowInMemoryCache) {
      this.inMemoryCache.set(key, value)
    }

    await CacheBuilder.redis?.hset(
      this.CACHE_KEY,
      key.toString(),
      Buffer.from(JSON.stringify(value))
    )

    if (this.expireAfterWrite) {
      await CacheBuilder.redis?.expire(this.CACHE_KEY, this.expireAfterWrite)
    }

    return value
  }

  public async invalidate(key: K): Promise<void> {
    if (this.alwaysAllowInMemoryCache) {
      this.inMemoryCache.delete(key)
    }

    await CacheBuilder.redis?.hdel(this.CACHE_KEY, key.toString())
  }

  public async invalidateAll(): Promise<void> {
    if (this.alwaysAllowInMemoryCache) {
      this.inMemoryCache.clear()
    }

    await CacheBuilder.redis?.del(this.CACHE_KEY)
  }
}