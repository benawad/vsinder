export const mutation = async (
  path: string,
  body: any,
  { method }: { method: "POST" | "PUT" } = { method: "POST" }
) => {
  try {
    const r = await fetch(apiBaseUrl + path, {
      method,
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        "access-token": accessToken,
        "refresh-token": refreshToken,
      },
    });
    if (r.status !== 200) {
      throw new Error(await r.text());
    }
    const _accessToken = r.headers.get("access-token");
    const _refreshToken = r.headers.get("refresh-token");
    if (_accessToken && _refreshToken) {
      accessToken = _accessToken;
      refreshToken = _refreshToken;
      tsvscode.postMessage({
        type: "tokens",
        accessToken: _accessToken,
        refreshToken: _refreshToken,
      });
    }
    const d = await r.json();
    return d;
  } catch (err) {
    tsvscode.postMessage({
      type: "onError",
      value: err.message,
    });
    throw err;
  }
};
