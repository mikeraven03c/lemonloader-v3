function dependency(type) {
  return {
    script: (src) =>
      new Promise((res) => {
        const script = document.createElement('script');
        script.src = src;
        if (type) {
          script.type = type;
        }

        script.onload = () => res(script);
        document.body.append(script);
      }),
  };
}
