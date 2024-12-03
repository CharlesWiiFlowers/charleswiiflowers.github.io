import Card from './components/card.tsx';
import ProfileCard from './components/ProfileCard.tsx';
import data from "./assets/data.json"

function InfoBody(){
    return (
        <div>
            < ProfileCard title={data.name} content={data['about-me']} avatarUrl='/avatar.webp'/>
            < Card title="Hola" content=""/>
        </div>)
}

function SwitchHeader(){
    return <div></div>
}

function ContentPage(){
    return (
        <div>
            < InfoBody />
            < SwitchHeader />
        </div>
    )
}

function BodyPage(){
    return < ContentPage />
}

export default function App(){
    return < BodyPage />;
}