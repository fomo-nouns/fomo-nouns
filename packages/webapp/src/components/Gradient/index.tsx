import classes from './Gradient.module.css';

export enum GradientStyle {
    PURPLE_FUCHSIA,
    FUCHSIA_PURPLE
}

interface GradientProps {
    style: GradientStyle
}

const Gradient: React.FC<GradientProps> = props => {
    const { children, style } = props;

    let styleClass;
    switch(style) {
        case GradientStyle.PURPLE_FUCHSIA:
            styleClass = classes.purpleFuchsia;
            break;
        case GradientStyle.FUCHSIA_PURPLE:
            styleClass = classes.fuchsiaPurple;
            break;
        default:
            styleClass = classes.purpleFuchsia;
            break;
    }

    return (
        <>
            <div className={styleClass}>
                {children}
            </div>
        </>
    )
}

export default Gradient;