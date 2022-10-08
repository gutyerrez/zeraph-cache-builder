/// <reference path='../../@types/cache.d.ts' />

import { Cache } from '@zeraph/cache-builder/data'

export class LoadingCache<K, V> {
  public expireAfterWrite?: number
  public expireAfterAccess?: number

  public maximumSize?: number

  public fetcher?: (key: K) => V | undefined | null

  constructor(
    cache: Cache<K, V>,
    fetcher?: (key: K) => V | undefined | null
  ) {
    this.fetcher = fetcher

    this.expireAfterWrite = cache.expireAfterWrite
    this.expireAfterAccess = cache.expireAfterAccess
    this.maximumSize = cache.maximumSize
  }
}