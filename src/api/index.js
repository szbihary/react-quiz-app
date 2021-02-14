import { QUIZ_API_RANDOM } from "../config";

async function fetchData(url) {
  let data;
  try {
    const response = await fetch(url);
    data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(new Error(err?.message || data));
  }
}

export const fetchRandomQuestion = async () => {
  const history = await fetchData(QUIZ_API_RANDOM);
  return history;
};
