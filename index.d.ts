import { StoreonStore, StoreonDispatch } from 'storeon'

export function StoreonProvider<T extends StoreonStore>(props: {
  store: T;
  children: any;
}): any

export function useStoreon<State extends object = {}, EventsMap = any>():
  [State, StoreonDispatch<EventsMap>]