import "./Collections.css";
import CollectionItem from "../CollectionItem/CollectionItem";

export default function Collections() {
  return (
    <div className="collections">
      <div className="collections-grid">
        <CollectionItem
          src="/pins/pin1.jpg"
          pinCount={15}
          timeAgo="2w"
          alt="Collection 1"
          name="Travel Destinations"
        />
        <CollectionItem
          src="/pins/pin2.jpg"
          pinCount={8}
          timeAgo="1mo"
          alt="Collection 2"
          name="Home Decor Ideas"
        />
        <CollectionItem
          src="/pins/pin3.jpg"
          pinCount={23}
          timeAgo="3d"
          alt="Collection 3"
          name="Recipe Collection"
        />
        <CollectionItem
          src="/pins/pin4.jpg"
          pinCount={7}
          timeAgo="5d"
          alt="Collection 4"
          name="Fashion Inspiration"
        />
        <CollectionItem
          src="/pins/pin5.jpg"
          pinCount={42}
          timeAgo="1w"
          alt="Collection 5"
          name="DIY Projects"
        />
        <CollectionItem
          src="/pins/pin6.jpg"
          pinCount={3}
          timeAgo="2mo"
          alt="Collection 6"
          name="Web Design"
        />
        <CollectionItem
          src="/pins/pin7.jpg"
          pinCount={19}
          timeAgo="4d"
          alt="Collection 7"
          name="Art & Design"
        />
        <CollectionItem
          src="/pins/pin8.jpg"
          pinCount={11}
          timeAgo="6d"
          alt="Collection 8"
          name="Photography Tips"
        />
        <CollectionItem
          src="/pins/pin9.jpg"
          pinCount={5}
          timeAgo="3mo"
          alt="Collection 9"
          name="Wedding Planning"
        />
      </div>
    </div>
  );
}
