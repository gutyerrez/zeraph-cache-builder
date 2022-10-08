import { IProvider } from '@zeraph/provider'

export interface ICacheProvider<K, V> extends IProvider {
  get(key: K): Promise<V | undefined | null>

  getIfPresent(key: K): Promise<V | undefined | null>

  getAll(): Promise<Array<V>>

  put(key: K, value: V): Promise<V>

  invalidate(key: K): Promise<void>

  invalidateAll(): Promise<void>
}