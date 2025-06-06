import './Gallery.css'
import GalleryImg from '../GalleryImg/GalleryImg'

const temp = [
    {
        id: 1,
        link: "/pins/pin1.jpg",
        width: 1920,
        height: 1280
    },
    {
        id: 2,
        link: "/pins/pin2.jpg",
        width: 1920,
        height: 1442,
    },
    {
        id: 3,
        link: "/pins/pin3.jpg",
        width: 1920,
        height: 1280,
    },
    {
        id: 4,
        link: "/pins/pin4.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 5,
        link: "/pins/pin5.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 6,
        link: "/pins/pin6.jpg",
        width: 1920,
        height: 2876,
    },{
        id: 7,
        link: "/pins/pin7.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 8,
        link: "/pins/pin8.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 9,
        link: "/pins/pin9.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 10,
        link: "/pins/pin10.jpg",
        width: 1920,
        height: 2878,
    },{
        id: 11,
        link: "/pins/pin11.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 12,
        link: "/pins/pin12.jpg",
        width: 1920,
        height: 2834,
    },{
        id: 13,
        link: "/pins/pin13.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 14,
        link: "/pins/pin14.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 15,
        link: "/pins/pin15.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 16,
        link: "/pins/pin16.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 17,
        link: "/pins/pin17.jpg",
        width: 1920,
        height: 2931,
    },{
        id: 18,
        link: "/pins/pin18.jpg",
        width: 1920,
        height: 2876,
    },{
        id: 19,
        link: "/pins/pin19.jpg",
        width: 1920,
        height: 2880,
    },{
        id: 20,
        link: "/pins/pin20.jpg",
        width: 1920,
        height: 1904,
    },{
        id: 21,
        link: "/pins/pin21.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 22,
        link: "/pins/pin22.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 23,
        link: "/pins/pin23.jpg",
        width: 1920,
        height: 1280,
    },{
        id: 24,
        link: "/pins/pin24.jpg",
        width: 1920,
        height: 1037,
    },{
        id: 25,
        link: "/pins/pin25.jpg",
        width: 1920,
        height: 1311,
    },
]

export default function Gallery() {
  return (
    <div className="galleryGrid">
        {temp.map(item => {
            return <GalleryImg key={item.id} item={item}/>
        })}
    </div>
  )
}
