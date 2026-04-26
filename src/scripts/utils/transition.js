export const pageTransition = async (container, callback) => {
  container.classList.add('fade-out');

  await new Promise((resolve) => setTimeout(resolve, 300));

  await callback();

  container.classList.remove('fade-out');
  container.classList.add('fade-in');

  setTimeout(() => {
    container.classList.remove('fade-in');
  }, 300);
};