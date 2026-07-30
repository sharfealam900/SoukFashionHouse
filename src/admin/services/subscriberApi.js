import api from "../../api/axios";



export const getSubscribers = () => {
  return api.get("/subscribers");
};

export const deleteSubscriber = (id) => {
  return api.delete(`/subscribers/${id}`);
};

export const exportSubscribers = async () => {
  const response = await api.get(
    "/subscribers/export",
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.setAttribute(
    "download",
    "subscribers.csv"
  );

  document.body.appendChild(link);

  link.click();

  link.remove();
};