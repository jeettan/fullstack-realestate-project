import { Paper } from "@mui/material";

export interface ItemProps {
  item: {
    download_url: string;
  };
}

const Item = (props: ItemProps) => {
  return (
    <Paper>
      <div
        style={{
          backgroundImage: `url(${props.item.download_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
        }}
      ></div>
    </Paper>
  );
};

export default Item;
