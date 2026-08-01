import {
  CheckCircle,
  Circle,
  Truck,
  Package,
  ClipboardCheck,
  XCircle,
} from "lucide-react";
const steps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const iconMap = {
  Pending: <ClipboardCheck size={22} />,
  Confirmed: <CheckCircle size={22} />,
  Packed: <Package size={22} />,
  Shipped: <Truck size={22} />,
  "Out for Delivery": <Truck size={22} />,
  Delivered: <CheckCircle size={22} />,
  Cancelled: <XCircle size={22} />,
};

export default function OrderTracking({ order }) {
  if (!order) return null;

  if (order.orderStatus === "Cancelled") {
    return (
      <div className="tracking-card">

        <h4 className="mb-4">
          Order Tracking
        </h4>

        <div className="tracking-cancelled">

          <XCircle
            color="#dc3545"
            size={40}
          />

          <div>

            <h5 className="mb-1 text-danger">
              Order Cancelled
            </h5>

            <p className="mb-0">
              This order has been cancelled.
            </p>

          </div>

        </div>

      </div>
    );
  }

  const currentIndex = steps.indexOf(
    order.orderStatus
  );

  return (
    <div className="tracking-card">

      <h4 className="mb-4">
        Order Tracking
      </h4>

      {steps.map((step, index) => {
        const completed =
          index <= currentIndex;

        const history =
          order.trackingHistory?.find(
            (item) =>
              item.status === step
          );

        return (
          <div
            key={step}
            className="tracking-item"
          >

            <div
              className={
                completed
                  ? "tracking-icon completed"
                  : "tracking-icon"
              }
            >
              {completed
                ? iconMap[step]
                : <Circle size={18} />}
            </div>

            <div className="tracking-content">

              <h6
                className={
                  completed
                    ? "text-success"
                    : "text-muted"
                }
              >
                {step}
              </h6>

              {history && (
                <small className="text-muted">

                  {new Date(
                    history.updatedAt
                  ).toLocaleString(
                    "en-IN"
                  )}

                </small>
              )}

            </div>

          </div>
        );
      })}

      <hr />

      <div>

        <strong>
          Estimated Delivery
        </strong>

        <br />

        <span className="text-success">

          {new Date(
            order.estimatedDelivery
          ).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}

        </span>

      </div>

    </div>
  );
}