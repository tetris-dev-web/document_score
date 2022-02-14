// ----------------------------------------------------------------------

export default function fakeRequest(time: any) {
  return new Promise((res) => setTimeout(res, time));
}
