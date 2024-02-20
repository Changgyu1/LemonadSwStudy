import { apiClient } from "./ApiClient";
export default function RetrieveAllPostsForPostApi() {
  apiClient.get(`/post_list`);
}
