import Card from './components/card.tsx';

function InfoBody(){
    return < Card title="Hola" content=""/>
}

function SwitchHeader(){
    return < Card title="Hello" content="What's up world?" />
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