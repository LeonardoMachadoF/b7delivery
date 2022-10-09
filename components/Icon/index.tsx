import MailSent from './MailSent.svg';
import ArrowRight from './ArrowRight.svg'
import Dollar from './Dollar.svg'
import Card from './Card.svg'
import Confirmed from './Confirmed.svg'
import Cupom from './Cupom.svg'
import Location from './Location.svg'
import { useMemo } from 'react';

type Props = {
    icon: string;
    color: string;
    width: number;
    height: number;
}

export const Icon = ({ icon, color, width, height }: Props) => {
    const Icons: { [key: string]: JSX.Element } =
    {
        'arrowRight': <ArrowRight color={color} />,
        'mailSent': <MailSent color={color} />,
        'dollar': <Dollar color={color} />,
        'card': <Card color={color} />,
        'confirmed': <Confirmed color={color} />,
        'cupom': <Cupom color={color} />,
        'location': <Location color={color} />,
    }

    let Component = useMemo(() => {
        return Icons[icon]
    }, [icon, color])

    return (
        <div style={{ width, height }}>
            {Icons[icon] && Component}
        </div>
    )
}