export default function StateBlock({ title, text, action }) {
  return (
    <div className="state-block">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
