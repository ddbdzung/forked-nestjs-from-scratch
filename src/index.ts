const main = (a: string) => {
  try {
    console.log('[DEBUG][DzungDang] a:', a);
    throw new Error('Me here to throw error');
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }
};
main('helo');
