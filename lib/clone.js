const clone = (o) => {
  return JSON.parse(JSON.stringify(o));
}

export { clone };
