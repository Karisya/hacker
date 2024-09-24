import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews } from '../../redux/reducers/newsSlice';
import { List, Button, Spin } from 'antd';
import {Link} from 'react-router-dom'

const TableNews = () => {

  const dispatch = useDispatch();
  const news = useSelector((state) => state.news.items);
  const status = useSelector((state) => state.news.status);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const refreshNews = () => {
    dispatch(fetchNews());
  };

  return (
    <div>
      <Button onClick={refreshNews} type="primary">Обновить новости</Button>
      {status === 'loading' ? (
        <Spin size="large" />
      ) : (
        <List
          dataSource={news}
          renderItem={(item) => (
            <List.Item>
                    <List.Item.Meta
                    title={item.title}
                    description={`Рейтинг: ${item.score}, Автор: ${item.by}, Дата: ${new Date(item.time * 1000).toLocaleString()}`}
                    />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TableNews;
