export default function validate(value: string, { length }: Record<string, any> = {}) {
  return value.length >= length;
}
