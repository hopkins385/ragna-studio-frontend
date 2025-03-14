export type StringKeyOf<T> = Extract<keyof T, string>;
export type CallbackType<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>,
> = T[EventName] extends any[] ? T[EventName] : [T[EventName]];
export type CallbackFunction<T extends Record<string, any>, EventName extends StringKeyOf<T>> = (
  ...props: CallbackType<T, EventName>
) => any;
export type EditorContent = Content | Fragment | string | null;
