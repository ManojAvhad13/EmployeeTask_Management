import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data = [], colors = [] }) => {
    return (
        <div>
            <ResponsiveContainer width="100%" height={325}>
                <PieChart>
                    <Pie
                        data={Array.isArray(data) ? data : []}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        innerRadius={100}
                        labelLine={false}
                    >
                        {Array.isArray(data) && data.length > 0 &&
                            data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length] || "#8884d8"}
                                />
                            ))
                        }
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomPieChart;
