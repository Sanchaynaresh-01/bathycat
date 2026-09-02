from app.crud.product import get as get_product, get_multi as get_products, get_active as get_active_products, create as create_product
from app.crud.component import get_category, get_categories_with_components, create_category, get_component, create_component, update_component, delete_component, get_constraints, create_constraint, delete_constraint
from app.crud.configuration import get as get_configuration, create as create_configuration, get_by_user as get_user_configurations, update as update_configuration, delete as delete_configuration
from app.crud.quote import get as get_quote, get_multi as get_quotes, create as create_quote, get_by_email as get_quotes_by_email, update_status as update_quote_status, get_approved_quotes
