import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, List, Spin, Typography, Card } from "antd";

const { Title, Paragraph, Link } = Typography;

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        setItem(res.data);
        if (res.data.kids) {
          fetchComments(res.data.kids);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchItem();
  }, [id]);

  const fetchComments = async (commentIds) => {
    setLoading(true);
    try {
      const commentPromises = commentIds.map((commentId) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`)
      );
      const commentsRes = await Promise.all(commentPromises);
      setComments(commentsRes.map((res) => res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNestedComments = async (commentId, index) => {
    try {
      const res = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
      );
      const updatedComments = [...comments];
      updatedComments[index].children = res.data.kids || [];
      setComments(updatedComments);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {item && (
        <Card style={{ marginBottom: "20px" }}>
          <Link href={item.url} target="_blank">
            <Title level={3}>{item.title}</Title>
          </Link>
          <Paragraph>{`Дата: ${new Date(item.time * 1000).toLocaleString()}`}</Paragraph>
          <Paragraph>{`Автор: ${item.by}`}</Paragraph>
          <Paragraph>{`Комментариев: ${item.descendants || 0}`}</Paragraph>
        </Card>
      )}

      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => fetchComments(item.kids)} type="primary" style={{ marginRight: "10px" }}>
          Обновить комментарии
        </Button>
        <Button onClick={() => navigate("/")} type="default">
          Назад к списку новостей
        </Button>
      </div>

      {loading ? (
        <Spin tip="Загрузка комментариев..." size="large" />
      ) : (
        <List
          bordered
          dataSource={comments}
          renderItem={(comment, index) => (
            <List.Item>
              <div>
                <Paragraph>{comment.text || "Комментарий отсутствует"}</Paragraph>
                <Paragraph>{`Автор: ${comment.by}`}</Paragraph>
                {comment.kids && !comment.children && (
                  <Button
                    onClick={() => fetchNestedComments(comment.id, index)}
                    type="link"
                  >
                    Загрузить вложенные комментарии
                  </Button>
                )}
                {comment.children && (
                  <List
                    bordered
                    dataSource={comment.children}
                    renderItem={(childId) => (
                      <List.Item>
                        <Paragraph>{`Комментарий ${childId}`}</Paragraph>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ItemDetails;
