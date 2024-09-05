import React, { useEffect } from "react";
import * as echarts from "echarts";

const CartAnalysis = ({ cartItems }) => {
  useEffect(() => {
    const chartDom = document.getElementById("cart-analysis-chart");
    const myChart = echarts.init(chartDom);

    // 数据分析逻辑
    const categoryCount = cartItems.reduce((acc, item) => {
      const category = item.category || "Others"; // 假设你有类别信息
      acc[category] = (acc[category] || 0) + item.quantity;
      return acc;
    }, {});

    const data = Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count,
    }));

    const option = {
      title: {
        text: "购物车商品类别分析",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "类别",
          type: "pie",
          radius: "50%",
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    // 当组件卸载时销毁图表实例
    return () => {
      myChart.dispose();
    };
  }, [cartItems]);

  return (
    <div
      id="cart-analysis-chart"
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
};

export default CartAnalysis;
