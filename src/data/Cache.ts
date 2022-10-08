/// <reference path='../../@types/cache.d.ts' />

export class Cache<K, V> {
  public expireAfterWrite?: number
  public expireAfterAccess?: number

  public maximumSize?: number

  constructor(
    expireAfterWrite?: number,
    expireAfterAccess?: number,
    maximumSize?: number
  ) {
    this.expireAfterWrite = expireAfterWrite
    this.expireAfterAccess = expireAfterAccess
    this.maximumSize = maximumSize
  }
}